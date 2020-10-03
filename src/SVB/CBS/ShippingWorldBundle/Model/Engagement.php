<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 15:40
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Engagement
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="MessageContent,Engagement")
 */
class Engagement implements EngagementInterface
{

    /**
     * @var int
     *
     * @OGM\Auto
     */
    private $id;

    /**
     * @var ServiceInterface
     *
     * @OGM\ManyToOne(relation="of_service")
     */
    private $serviceOrdered;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $quotedPriceTotal;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $quotedPricePrepayment;

    /**
     * @var ActorInterface
     *
     * @OGM\ManyToOne(relation="by_principal")
     */
    private $principal;

    /**
     * @var ActorInterface
     *
     * @OGM\ManyToOne(relation="of_agent")
     */
    private $agent;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return ServiceInterface
     */
    public function getServiceOrdered()
    {
        return $this->serviceOrdered;
    }

    /**
     * @return int
     */
    public function getQuotedPriceTotal()
    {
        return $this->quotedPriceTotal;
    }

    /**
     * @return int
     */
    public function getQuotedPricePrepayment()
    {
        return $this->quotedPricePrepayment;
    }

    /**
     * @return ActorInterface
     */
    public function getPrincipal()
    {
        return $this->principal;
    }

    /**
     * @return ActorInterface
     */
    public function getAgent()
    {
        return $this->agent;
    }

    /**
     * @param int $id
     * @return Engagement
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param ServiceInterface $serviceOrdered
     * @return Engagement
     */
    public function setServiceOrdered($serviceOrdered)
    {
        $this->serviceOrdered = $serviceOrdered;
        return $this;
    }

    /**
     * @param int $quotedPriceTotal
     * @return Engagement
     */
    public function setQuotedPriceTotal($quotedPriceTotal)
    {
        $this->quotedPriceTotal = $quotedPriceTotal;
        return $this;
    }

    /**
     * @param int $quotedPricePrepayment
     * @return Engagement
     */
    public function setQuotedPricePrepayment($quotedPricePrepayment)
    {
        $this->quotedPricePrepayment = $quotedPricePrepayment;
        return $this;
    }

    /**
     * @param ActorInterface $principal
     * @return Engagement
     */
    public function setPrincipal($principal)
    {
        $this->principal = $principal;
        return $this;
    }

    /**
     * @param ActorInterface $agent
     * @return Engagement
     */
    public function setAgent($agent)
    {
        $this->agent = $agent;
        return $this;
    }

    /**
     * @return Engagement
     */
    public static function create(){
        return new Engagement();
    }


}