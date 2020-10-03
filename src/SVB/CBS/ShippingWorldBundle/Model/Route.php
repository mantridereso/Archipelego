<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 24.09.15
 * Time: 14:31
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Route
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="Route")
 */
class Route implements RouteInterface
{

    /**
     * @OGM\Auto
     */
    private $id;

    /**
     * @var VillageInterface
     *
     * @OGM\ManyToOne(relation="origin")
     */
    private $origin;

    /**
     * @var VillageInterface
     *
     * @OGM\ManyToOne(relation="destination")
     */
    private $destination;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return VillageInterface
     */
    public function getOrigin()
    {
        return $this->origin;
    }

    /**
     * @return VillageInterface
     */
    public function getDestination()
    {
        return $this->destination;
    }

    /**
     * @param int $id
     * @return Route
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param VillageInterface $origin
     * @return Route
     */
    public function setOrigin($origin)
    {
        $this->origin = $origin;
        return $this;
    }

    /**
     * @param VillageInterface $destination
     * @return Route
     */
    public function setDestination($destination)
    {
        $this->destination = $destination;
        return $this;
    }

    /**
     * @return Route
     */
    public static function create(){
        return new Route();
    }


}