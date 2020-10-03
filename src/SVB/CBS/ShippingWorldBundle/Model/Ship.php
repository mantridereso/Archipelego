<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 24.09.15
 * Time: 13:36
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Ship
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="Ship")
 */
class Ship implements ShipInterface
{

    /**
     * @OGM\Auto
     */
    private $id;

    /**
     * @var string
     *
     * @OGM\Property
     * @OGM\Index
     */
    private $name;

    /**
     * @var WorldInterface
     *
     * @OGM\ManyToOne(relation="ship_within_world",direction="from")
     */
    private $world;

    /**
     * @var TransportInterface
     *
     * @OGM\ManyToOne(relation="current_transport")
     */
    private $currentTransport;


    /**
     * @var ShipperInterface
     *
     * @OGM\ManyToOne(relation="owned_by")
     */
    private $shipper;

    /**
     * @return int
     */
    public function getId(){
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return Ship
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return WorldInterface
     */
    public function getWorld()
    {
        return $this->world;
    }

    /**
     * @param WorldInterface $world
     * @return Ship
     */
    public function setWorld($world)
    {
        $this->world = $world;
        return $this;
    }

    /**
     * @return ShipperInterface
     */
    public function getShipper()
    {
        return $this->shipper;
    }

    /**
     * @return TransportInterface
     */
    public function getCurrentTransport()
    {
        return $this->currentTransport;
    }

    /**
     * @param mixed $id
     * @return Ship
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param ShipperInterface $shipper
     * @return Ship
     */
    public function setShipper($shipper)
    {
        $this->shipper = $shipper;
        return $this;
    }

    /**
     * @param TransportInterface $currentTransport
     * @return Ship
     */
    public function setCurrentTransport($currentTransport)
    {
        $this->currentTransport = $currentTransport;
        $currentTransport->setShip($this);
        return $this;
    }

    /**
     * @return Ship
     */
    public static function create(){
        return new Ship();
    }


    /**
     * @return array
     */
    public function export()
    {
        return [
            'name' => $this->getName()
        ];
    }

    public function exportState(\DateTime $dateTime)
    {
        if ($this->hasDeparted($dateTime) && !$this->hasArrived($dateTime)){
            return [
                'type' => 'on_route',
                'from' => [
                    'village' => $this->getCurrentTransport()->getRoute()->getOrigin()->getName(),
                    'island' => $this->getCurrentTransport()->getRoute()->getOrigin()->getIsland()->getName()
                ],
                'to' => [
                    'village' => $this->getCurrentTransport()->getRoute()->getDestination()->getName(),
                    'island' => $this->getCurrentTransport()->getRoute()->getDestination()->getIsland()->getName()
                ],
                'where' => (
                    ($dateTime->getTimestamp()
                        - $this->getCurrentTransport()->getDepartureTime()->getTimestamp()) /
                    ($this->getCurrentTransport()->getArrivalTime()->getTimestamp() -
                        $this->getCurrentTransport()->getDepartureTime()->getTimestamp()))
            ];
        }else{
            if ($this->hasArrived($dateTime)){
                return [
                    'type' => 'at_berth',
                    'where' => [
                        'village' => $this->getCurrentTransport()->getRoute()->getDestination()->getName(),
                        'island' => $this->getCurrentTransport()->getRoute()->getDestination()->getIsland()->getName()
                    ]
                ];
            }else{
                return [
                    'type' => 'at_berth',
                    'where' => [
                        'village' => $this->getCurrentTransport()->getRoute()->getOrigin()->getName(),
                        'island' => $this->getCurrentTransport()->getRoute()->getOrigin()->getIsland()->getName()
                    ]
                ];
            }
        }
    }

    public function hasDeparted(\DateTime $dateTime)
    {
        return $this->getCurrentTransport()->getDepartureTime()->diff($dateTime)->invert === 1;
    }

    public function hasArrived(\DateTime $dateTime)
    {
        return $this->getCurrentTransport()->getArrivalTime()->diff($dateTime)->invert === 1;
    }


}